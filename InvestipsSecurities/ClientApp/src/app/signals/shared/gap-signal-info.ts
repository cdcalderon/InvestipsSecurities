import { IGapSignal } from './gap-signal';
export interface ISignalsGapInfo {
    docs: IGapSignal[];
    limit: number;
    offset: number;
    total: number;

}
