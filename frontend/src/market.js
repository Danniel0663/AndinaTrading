import {createChart, CandlestickSeries, LineSeries} from 'lightweight-charts';

const usd = new Intl.NumberFormat('es-CO', {style:'currency',currency:'USD',currencyDisplay:'code'});
const timeLabel = seconds => new Date(seconds*1000).toLocaleTimeString('es-CO');
for (const panel of document.querySelectorAll('[data-market-chart]')) {
  const find = selector => panel.querySelector(selector);
  const instrument=find('#instrument'), interval=find('#interval');
  const price=find('[data-price]'), status=find('[data-status]'), detail=find('[data-detail]');
  const chart=createChart(find('[data-plot]'), {autoSize:true,layout:{textColor:'#576478'},grid:{vertLines:{color:'#eef0f5'},horzLines:{color:'#eef0f5'}},timeScale:{timeVisible:true,secondsVisible:false},localization:{timeFormatter:timeLabel}});
  let series, stop=()=>{};
  chart.subscribeCrosshairMove(event=>{
    const item=event.seriesData.get(series);
    detail.textContent=item ? timeLabel(item.time)+' · '+usd.format(item.close??item.value) : 'Mueve el cursor para consultar un precio.';
  });
  async function load(){
    stop();
    const abort=new AbortController();
    let timer, socket;
    stop=()=>{abort.abort();clearTimeout(timer);socket?.close();};
    const symbol=instrument.value, crypto=symbol.includes('-USD'), seconds=Number(interval.value);
    interval.disabled=!crypto;
    if(series) chart.removeSeries(series);
    series=crypto?chart.addSeries(CandlestickSeries,{upColor:'#5c6bc0',downColor:'#ad5267',borderVisible:false,wickUpColor:'#5c6bc0',wickDownColor:'#ad5267'}):chart.addSeries(LineSeries,{color:'#5c6bc0',pointMarkersVisible:true});
    price.textContent='—';status.textContent='Conectando…';
    find('[data-source]').textContent=crypto?'Mercado de referencia · Coinbase Exchange':'Acciones de la plataforma · Historial registrado';
    let last, fitted=false;
    async function history(){
      const url=crypto?'https://api.exchange.coinbase.com/products/'+symbol+'/candles?granularity='+seconds:'/mercado/historial?simbolo='+encodeURIComponent(symbol);
      const response=await fetch(url,{signal:abort.signal,cache:'no-store'});
      if(!response.ok) throw new Error('history');
      const rows=await response.json();
      if(abort.signal.aborted)return;
      const bars=crypto?rows.map(([time,low,high,open,close])=>({time,open,high,low,close})):rows;
      bars.sort((a,b)=>a.time-b.time);
      const points=[...new Map(bars.map(bar=>[bar.time,bar])).values()];
      series.setData(points);last=points.at(-1);
      price.textContent=last?usd.format(last.close??last.value):'—';
      if(!fitted && last){chart.timeScale().fitContent();fitted=true;}
      status.textContent=last?'Último registro · '+timeLabel(last.time):'Sin registros';
    }
    async function connect(){
      try{await history();}catch{if(!abort.signal.aborted)status.textContent='Historial no disponible';}
      if(abort.signal.aborted)return;
      if(!crypto){timer=setTimeout(connect,10000);return;}
      socket=new WebSocket('wss://ws-feed.exchange.coinbase.com');
      socket.onopen=()=>socket.send(JSON.stringify({type:'subscribe',product_ids:[symbol],channels:['ticker']}));
      socket.onmessage=({data})=>{
        if(abort.signal.aborted)return;
        const trade=JSON.parse(data);
        if(trade.type!=='ticker'||trade.product_id!==symbol)return;
        const value=Number(trade.price), t=Date.parse(trade.time)/1000, time=Math.floor(t/seconds)*seconds;
        if(!Number.isFinite(value)||!Number.isFinite(time)||(last && time<last.time))return;
        last=last?.time===time?{...last,high:Math.max(last.high,value),low:Math.min(last.low,value),close:value}:{time,open:value,high:value,low:value,close:value};
        series.update(last);price.textContent=usd.format(value);status.textContent='En directo · '+timeLabel(t);
      };
      socket.onclose=()=>{if(!abort.signal.aborted){status.textContent='Reconectando…';timer=setTimeout(connect,5000);}};
    }
    connect();
  }
  instrument.addEventListener('change',load);interval.addEventListener('change',load);
  load();
}
