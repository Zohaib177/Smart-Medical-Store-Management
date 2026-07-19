import { formatStockChange } from '../../utils/inventoryHelpers';
export default function StockChangeDisplay({ value }) { const number = Number(value) || 0; return <span className={`font-bold ${number > 0 ? 'text-emerald-700' : number < 0 ? 'text-red-700' : 'text-slate-600'}`} aria-label={`Stock change ${formatStockChange(number)}`}>{formatStockChange(number)}</span>; }
