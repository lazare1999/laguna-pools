import {AccountingClientModel} from "./accountingClientModel";
import {defaultGraphDataModel, GraphDataModel} from "./graphDataModel";

export interface AccountingModel {
    graphData: GraphDataModel;
    accountingClient: AccountingClientModel[];
}

export const defaultAccountingModel: AccountingModel = {
    graphData: defaultGraphDataModel,
    accountingClient: [],
};