
export interface Iuser{
    name:string,
    email:string,
    password:string
}

export interface Ijwtdecoded{
    user:Iuser,
    iat:number,
    exp:number,
}