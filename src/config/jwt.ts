import { User } from "@prisma/client";
import { sign } from "jsonwebtoken";
import { JWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from "./environment";
// import { User } from "src/modules/user/user.interface";


function generateAccessToken(user:User){
  return sign({userId: user.id},JWT_ACCESS_SECRET,{
    expiresIn:'5m'
  })
}

function generateRefreshToken(user:User){
  return sign({userId: user.id},JWT_REFRESH_SECRET,{
    expiresIn:'8h'
  })
}

function generateTokens(user:User){
  const accessToken = generateAccessToken(user)
  const refreshToken = generateRefreshToken(user)

  return {
    accessToken,
    refreshToken
  }
}

export {generateAccessToken, generateRefreshToken, generateTokens}