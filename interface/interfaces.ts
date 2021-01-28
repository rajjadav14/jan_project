
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

export interface IProfile{
    user:Iuser,
    company?:string,
    website?:string,
    location:string,
    status?:string,
    skills?:string,
    bio:string,
    githubusername:string,
    experience:any,
    education:{
        school:string,
        degree: string,
        feildofstudy:string,
        from:Date,
        to:Date,
        current:boolean,
        description:string, 
    },
    social:{
        youtube:String,
        twitter:String,
        facebook:String,
        linkedin:String,
        instagram:String,
    },
    date:Date,
}