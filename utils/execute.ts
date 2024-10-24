export function debounce<DebounceFunction extends (...args: any[])=>void>(func:DebounceFunction, wait: number): (...args: Parameters<DebounceFunction>)=>void{
    let timeout: ReturnType<typeof setTimeout>;
    return function( ...args: Parameters<DebounceFunction>){
        
        clearTimeout(timeout);
        timeout = setTimeout(() =>{
            func(...args)
        
        }, wait);
    };
  
  }