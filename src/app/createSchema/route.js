import { NextResponse } from "next/server"
import {createAttendeeSchema} from "../../lib/appwrite-server"
export async function GET(request){
    await createAttendeeSchema()
    return NextResponse.json({"message":"check your console"})
}