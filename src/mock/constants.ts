import { Response } from 'express';

export enum AppMockConstant {
    MockId = 'mock_id',
    MockName = 'mock_name',
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mockRequest = ({ body, params }: { body?: any; params?: any }) => {
    return {
        body,
        params,
    };
};

export const mockResponse = () => {
    const res = {} as Response;
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
};
