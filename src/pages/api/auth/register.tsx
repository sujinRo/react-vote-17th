import Joi from 'joi';
import User from '../../../models/userDetail';

export const register = async (ctx:any) => {
    //회원가입
    //Request Body 검증
    const schema = Joi.object().keys({
        username: Joi.string()
        .alphanum()
        .min(3)
        .max(20)
        .required(),
        password: Joi.string().required(),
    });

    const result = schema.validate(ctx.request.body);
    if(result.error){
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }

    const{username, password} = ctx.request.body;
    try{
        //username이 존재하는지
        const exists = await User.findByUsername(username);
        if(exists){
            ctx.status = 409; //conflict
            return;
        }

        const user = new User({
            username,
        });
        await user.setPassword(password);//비밀번호 설정
        await user.save(); //DB에 저장

        //hashedPassword 필드가 응답되지 않도록 데이터를 JSON으로 변환 후 delete를 통해 해당 필드 지워줌
        ctx.body = user.serialize();
    }
    catch (e){
        ctx.throw(500,e);
    }
};
