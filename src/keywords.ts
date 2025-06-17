export enum DBMLKeywords {
  Default = 'default',
  Increment = 'increment',
  Note = 'note',
  NotNull = 'not null',
  Table = 'Table',
  Unique = 'unique',
  Pk = 'pk',
  Indexes = 'indexes',
}

export enum PrismaScalars {
  String = 'String',
  Boolean = 'Boolean',
  Int = 'Int',
  Float = 'Float',
  DateTime = 'DateTime',
  Json = 'Json',
  BigInt = 'BigInt',
  Decimal = 'Decimal',
  Bytes = 'Bytes',
}

export const DBML_KEYWORDS = [
  // ── Top-level blocks
  'Project',
  'Table',
  'Enum',
  'Ref',
  'TableGroup',
  'TablePartial',
  'Sticky',

  // ── Sub-blocks
  'indexes',

  // ── Column modifiers
  'pk',
  'primary key',
  'increment',
  'unique',
  'null',
  'not null',
  'default',
  'note',

  // ── Index modifiers
  'type',
  'name',

  // ── Ref options
  'on delete',
  'on update',
  'delete',
  'update',
  'cascade',
  'restrict',
  'no action',
  'set null',
  'set default',

  // ── Table-level config
  'headercolor',
];