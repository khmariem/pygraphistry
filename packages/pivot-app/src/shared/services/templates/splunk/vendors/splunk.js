export const defaultFields = [
    'EventID',

    '_cd',
    '_indextime',
    '_raw',
    '_time',
    '_bkt',
    '_indextime',
    '_kv',
    '_serial',
    '_si',
    '_sourcetype',
    '_title',

    'asn',
    'category',
    'city',
    'continent',
    'country',
    'date_hour',
    'date_mday',
    'date_minute',
    'date_month',
    'date_second',
    'date_wday',
    'date_year',
    'date_zone',
    'dest',
    'dest_class',
    'dest_hostname',
    'dest_interface',
    'dest_ip',
    'dest_location',
    'dest_mac',
    'dest_port',
    'dest_zone',
    'dst_hostname',
    'dst_interface',
    'dst_ip',
    'dst_location',
    'dst_mac',
    'dst_port',
    'dst_zone',
    'domain',
    'dst',
    'dhost',
    'dmac',
    'dpt',
    'dntdom',
    'dvc',
    'dvc_host',
    'eventtype',
    'extracted_eventtype',
    'extracted_host',
    'extracted_index',
    'extracted_linecount',
    'extracted_source',
    'extracted_sourcetype',
    'extracted_splunk_server',
    'file',
    'filename',
    'host',
    'index',
    'linecount',
    'misc',
    'msg',
    'message',
    'name',
    'product',
    'protocol',
    'punct',
    'raw',
    'region',
    'source',
    'sequence_number',
    'search_name',
    'severity',
    'signature',
    'source',
    'sourcetype',
    'splunk_server',
    'splunk_server_group',
    'smac',
    'spt',
    'src',
    'src_class',
    'src_interface',
    'src_host',
    'src_ip',
    'src_location',
    'src_mac',
    'src_port',
    'src_user',
    'src_zone',
    'time',
    'timestamp',
    'type',
    'timeendpos',
    'timestartpos',
    'unix_category',
    'unix_group',
    'uri_path',
    'url',
    'vendor'
];

export const desiredAttributes = [
    'EventID',

    'asn',
    'category',
    'city',
    'continent',
    'country',
    'dest',
    'dest_class',
    'dest_hostname',
    'dest_interface',
    'dest_ip',
    'dest_location',
    'dest_mac',
    'dest_port',
    'dest_zone',
    'dst_hostname',
    'dst_interface',
    'dst_ip',
    'dst_location',
    'dst_mac',
    'dst_port',
    'dst_zone',
    'domain',
    'dhost',
    'dmac',
    'dpt',
    'dntdom',
    'dst',
    'dvc',
    'dvc_host',
    'eventtype',
    'extracted_eventtype',
    'extracted_host',
    'extracted_index',
    'extracted_linecount',
    'extracted_source',
    'extracted_sourcetype',
    'extracted_splunk_server',
    'file',
    'filename',
    'host',
    'index',
    'linecount',
    'misc',
    'msg',
    'message',
    'name',
    'product',
    'protocol',
    'punct',
    'raw',
    'region',
    'search_name',
    'sequence_number',
    'severity',
    'signature',
    'source',
    'sourcetype',
    'splunk_server',
    'splunk_server_group',
    'smac',
    'spt',
    'src',
    'src_class',
    'src_host',
    'src_interface',
    'src_ip',
    'src_location',
    'src_mac',
    'src_port',
    'src_user',
    'src_zone',
    'time',
    'timestamp',
    'type',
    'unix_category',
    'unix_group',
    'uri_path',
    'url',
    'vendor'
];

export const desiredEntities = [
    'EventID',

    'dest',
    'dest_hostname',
    'dest_ip',
    'dest_mac',
    'dest_user',
    'dst_hostname',
    'dst_ip',
    'dst_mac',
    'dst_user',
    'dhost',
    'dmac',
    'dst',
    'file',
    'filename',
    'msg',
    'message',
    'sequence_number',
    'smac',
    'src',
    'src_host',
    'src_hostname',
    'src_ip',
    'src_mac',
    'src_user'
];

export const colTypes = {
    asn: 'id',
    city: 'city',
    continent: 'continent',
    country: 'country',
    dhost: 'host',
    dmac: 'mac',
    dest: 'ip',
    dest_hostname: 'host',
    dest_ip: 'ip',
    dest_location: 'url',
    dest_mac: 'mac',
    dest_port: 'port',
    dest_user: 'user',
    dst: 'ip',
    dst_hostname: 'host',
    dst_ip: 'ip',
    dst_location: 'url',
    dst_mac: 'mac',
    dst_port: 'port',
    dst_user: 'user',
    EventID: 'event',
    file: 'file',
    filename: 'file',
    host: 'url',
    index: 'log',
    msg: 'alert',
    message: 'alert',
    product: 'product',
    region: 'geo',
    search_name: 'log',
    sequence_number: 'id',
    source: 'log',
    smac: 'mac',
    src: 'ip',
    src_host: 'host',
    src_hostname: 'host',
    src_ip: 'ip',
    src_location: 'url',
    src_mac: 'mac',
    src_port: 'port',
    src_user: 'user',
    uri_path: 'url',
    url: 'url',
    vendor: 'vendor'
};

//dst, event, payload, session, src
export const refTypes = {
    dhost: 'dst',
    dmac: 'dst',
    dest: 'dst',
    dest_hostname: 'dst',
    dest_ip: 'dst',
    dest_location: 'dst',
    dest_mac: 'dst',
    dest_port: 'dst',
    dest_user: 'dst',
    dst: 'dst',
    dst_hostname: 'dst',
    dst_ip: 'dst',
    dst_location: 'dst',
    dst_mac: 'dst',
    dst_port: 'dst',
    dst_user: 'dst',
    EventID: 'event',
    file: 'payload',
    filename: 'payload',
    host: 'session',
    index: 'session',
    msg: 'payload',
    message: 'payload',
    product: 'session',
    search_name: 'session',
    sequence_number: 'session',
    smac: 'src',
    source: 'session',
    src: 'src',
    src_host: 'src',
    src_hostname: 'src',
    src_ip: 'src',
    src_location: 'src',
    src_mac: 'src',
    src_port: 'src',
    src_user: 'src',
    uri_path: 'payload',
    url: 'payload',
    vendor: 'session'
};

export const fieldsBlacklist = defaultFields.filter(
    x => desiredAttributes.indexOf(x) === -1 && desiredEntities.indexOf(x) === -1
);
export const attributesBlacklist = defaultFields.filter(x => desiredAttributes.indexOf(x) === -1);
export const entitiesBlacklist = defaultFields.filter(x => desiredEntities.indexOf(x) === -1);

export const product = 'Splunk';
export const productIdentifier = {};