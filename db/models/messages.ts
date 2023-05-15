import { Field, PrimaryKey, SearchField, TigrisCollection, TigrisDataTypes } from '@tigrisdata/core';

@TigrisCollection('messages')
export class Message {
  @Field()
  @SearchField()
  from!: string;

  @PrimaryKey(TigrisDataTypes.INT64, { order: 1, autoGenerate: true })
  id?: string;

  @Field(TigrisDataTypes.BYTE_STRING)
  media!: string;

  @Field()
  @SearchField()
  messageType!: string;

  @Field()
  @SearchField()
  text!: string;

  @Field(TigrisDataTypes.DATE_TIME)
  timestamp!: Date;

  @Field()
  uid!: string;
}
