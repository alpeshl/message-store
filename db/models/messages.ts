import { Field, PrimaryKey, TigrisCollection, TigrisDataTypes } from '@tigrisdata/core';

@TigrisCollection('messages')
export class Message {
  @Field(TigrisDataTypes.STRING)
  from!: string;

  @Field()
  text!: string;

  @Field(TigrisDataTypes.STRING)
  timestamp!: string;

  @PrimaryKey({ order: 1 })
  uid!: string;
}
