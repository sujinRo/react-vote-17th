import mongoose, {Schema} from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new Schema({
    username: String,
    hashedPassword: String,
});

//인스턴스 메서드: 문서를 통해 만든 문서 인스턴스에서 사용할 수 있는 함수
UserSchema.methods.setPassword = async function(password) { //this를 이용해야 하기 때문에 function 키워드 이용 
    const hash = await bcrypt.hash(password, 10);
    this.hashedPassword = hash;
};

UserSchema.methods.checkPassword = async function(password) {
    const result = await bcrypt.compare(password, this.hashedPassword);
    return result; // true/false
};

//스태틱 메서드: 모델에서 바로 사용할 수 있는 함수
UserSchema.statics.findByUsername = function(username) {
    return this.findOne({username});
};

const User = mongoose.model('User', UserSchema);
export default User;