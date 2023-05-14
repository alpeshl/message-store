import { Field, PrimaryKey, TigrisCollection, TigrisDataTypes } from '@tigrisdata/core';

@TigrisCollection('messages')
export class Message {
  @Field(TigrisDataTypes.INT64)
  from!: string;

  @Field()
  text!: string;

  @Field(TigrisDataTypes.DATE_TIME)
  timestamp!: Date;

  @PrimaryKey({ order: 1 })
  uid!: number;
}
