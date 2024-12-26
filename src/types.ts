export type FunctionResult = number | string | number[];

export type MethodFunction<InputValue> = (_: InputValue, filePath?: string) => FunctionResult;

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint, @typescript-eslint/no-explicit-any
export type TMethod<InputType extends any> = {
    label: string;
    fn: MethodFunction<InputType>;
    type: 'fib' | 'huffman';
}

export type TFibMethod = TMethod<number> & {type?: 'fib'};
export type THuffmanMethod = TMethod<string> & {type?: 'huffman'};

export type TMethodResult = {
    method: TFibMethod | THuffmanMethod;
    time: number;
    result: FunctionResult;
}

export type CodesType = {[key: string]: string};

export type MethodExecution = {
    methodIndex: number;
    value: string | number;
    filePath?: string;
}

export type MethodExecutionFx = (params: MethodExecution) => TMethodResult;

