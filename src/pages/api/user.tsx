import type { NextApiRequest, NextApiResponse } from "next";
import userData from "../../jsons/userData.json";
import jwt from "jsonwebtoken";

const userArray = userData.users;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { id, password } = req.body;
    var userItem = userArray.find((object) => object.id == id);
    console.log(userItem);
    if (userItem != null) {
      if (userItem.password == password) {
        const secret = "Secret_Key";
        try {
          const accessToken = await new Promise((resolve, reject) => {
            jwt.sign(
              {
                memberId: userItem?.id, //payload에 담을 id
                memberName: userItem?.name, //payload에 담을 name
              },
              secret,
              {
                expiresIn: "5m", //token 유효 시간
              },
              (err, token) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(token);
                }
              }
            );
          });
          res.json({ success: true, accessToken }); //token담아서 response
        } catch (err) {
          console.log(err);
          res.json({ success: false, errormessage: "토큰 서명에 실패했습니다." });
        }
      } else {
        res.json({ success: false, errormessage: "아이디와 비밀번호가 일치하지 않습니다." });
      }
    } else {
      res.json({ success: false, errormessage: "아이디와 비밀번호가 일치하지 않습니다." });
    }
  }
}