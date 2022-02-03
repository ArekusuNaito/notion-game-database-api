import { GraphQLSchema} from "graphql";
import { RootTypeQL } from "./types";

export const apiSchema = new GraphQLSchema({query:RootTypeQL});