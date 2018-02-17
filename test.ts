import {EventEmitter} from '@angular/core';

export namespace Subscr {
    
    interface Subscribe {
        event: any,
        root: Array<string>
    }

    let _subscribables: any = {};

    export function Subscribe( name: string | symbol, root: boolean = !1 ) : Function {
        return (target: any, propertyKey: string | symbol): void => {

            let value: any = target[propertyKey],
                subscribeParams: Subscribe = {
                    event: null,
                    root: []
                };

            const getter = (): any => value;
            const setter = (val: any) => value = val;


            if (!_subscribables[name]) {
                if (root)
                    _subscribables[name].root.push(propertyKey);

                subscribeParams.event = new EventEmitter();
                _subscribables[name] = subscribeParams;
            }
            console.log(value);

            Reflect.deleteProperty[propertyKey];

            Reflect.defineProperty(target, propertyKey, {
                get: getter,
                set: setter
            });

            _subscribables[name].event.subscribe((value: any): void => {

                console.log(value);
                target[propertyKey] = value;

                if (_subscribables[name].root.indexOf(propertyKey) < 0)
                    target[propertyKey] = value;
            });

            _subscribables[name].event.emit(800);
        }
    }
}
