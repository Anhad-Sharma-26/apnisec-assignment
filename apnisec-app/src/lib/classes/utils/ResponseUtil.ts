import { IApiResponse } from "../../types";
import {NextResponse} from "next/server";

export class ResponseUtil {
    static success<T>(data: T, message?:string, status: number = 200):NextResponse{
        const response: IApiResponse<T> = {
            success: true,
            message: message,
            data: data
        };
        return NextResponse.json(response, {status});
    }

    static error(message: string, status: number = 500):NextResponse{
        const response: IApiResponse = {
            success: false,
            message: message
        };
        return NextResponse.json(response, {status});
    }
     static created<T>(data: T, message: string = 'Resource created successfully'): NextResponse {
    return this.success(data, message, 201);
  }

  static noContent(): NextResponse {
    return new NextResponse(null, { status: 204 });
  }
}