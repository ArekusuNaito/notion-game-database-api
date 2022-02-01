import { Response} from "express";



export function responseHandler(response:Response,responseData:any)
{
    //I want to make this one work with a try-catch
    //Then send a status 500 if something break
}

export function notFoundHandler(response:Response,responseData:any)
{
    if(responseData)response.status(200).json(responseData)
    else response.status(404).send('404 - Request data not found');
}
