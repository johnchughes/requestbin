
interface IAPIRequestLogger
{
    LogRequestAsync(RequestData : any, Partition : string) : Promise<void>
}

export { IAPIRequestLogger }