import { IStoch307Signal } from './stoch307-signal.model';
export interface ISignalsStoch307Info {
    docs: IStoch307Signal[];
    limit: number;
    offset: number;
    total: number;

}
