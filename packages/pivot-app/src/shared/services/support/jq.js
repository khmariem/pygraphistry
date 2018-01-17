//Pipe to jq
// -- Not using node-jq as it can't handle large files
// -- Not using spawn-rx as it doesn't do sufficient error handling
//    (see bottom of file for sketch)
// -- blacklists IO (include/import) in transform

import { Observable } from 'rxjs';
import { spawn } from 'child_process';

import { VError } from 'verror';

function create(str, args, subscriber) {
    const child = spawn('jq', args, { cwd: '.', env: '' });

    const buffers = [];
    child.stdout.on('data', function(data) {
        buffers.push(data);
    });

    child.stderr.on('data', function(data) {
        subscriber.error(new Error(data.toString('utf8') || 'jq error'));
    });

    //some reason this helps quiet errors
    child.stdin.on('error', function() {
        /* do nothing */
    });

    child.on('exit', function(code) {
        if (code === 0) {
            try {
                subscriber.next(JSON.parse(Buffer.concat(buffers).toString('utf8')));
                subscriber.complete();
            } catch (e) {
                subscriber.error(e);
            }
        } else {
            subscriber.error(new Error({ code: code }));
        }
    });

    child.stdin.write(str, function(flushed) {
        if (flushed instanceof Error) {
            try {
                child.kill();
            } catch (e) {
                /* do nothing */
            }
        } else {
            child.stdin.end();
        }
    });
}

export function jq(str, transform = '.', args = []) {
    return Observable.create(function(subscriber) {
        try {
            const cmd = (args instanceof Array ? args : [args]).concat(transform);
            create(str, cmd, subscriber);
        } catch (e) {
            subscriber.error(new Error({ msg: 'Failed to call', e: e }));
        }
    }).take(1);
}

//currently no built-in way to prevent io, so blacklist modules for now
export function jqSafe(str, transform = '.', args = []) {
    if (isJqSafe(transform) !== true) {
        return Observable.throw(new Error('Include and import terms not allowed'));
    } else {
        return jq(str, transform, args);
    }
}

// ?str -> true || VError
// Check jq for io. Automatically used by jqSafe.
export function isJqSafe(jq) {
    if ((jq || '').match(/\|.*(include|import)\s/)) {
        return new VError(
            {
                name: 'JqSandboxException',
                cause: new Error('JqSandboxException'),
                info: { jq }
            },
            'JQ include and imports disallowed',
            { jq }
        );
    } else {
        return true;
    }
}

//==============

/*
//I wish it was this version but does not handle jq errors
var Rx = require('rx');
var spawn2 = require('spawn-rx').spawn;
spawn2('jq', ['|}.matches'], {stdin: Rx.Observable.from(JSON.stringify(json))})
    .subscribe(
        function (out) { console.log('test out2', out); },
        function (err) { console.log('test err2', err); },
        function () { console.log('done!2'); });
*/