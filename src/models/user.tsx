import mongoose, {Schema, Document, Model} from 'mongoose';
import bcrypt from 'bcrypt';

interface IUser {
    username: string;
    hashedPassword: string;
}

interface IUserDocument extends IUser, Document{
    setPassword: (password: string) => Promise<void>;
    checkPassword: (password: string) => Promise<boolean>;
    serialize: () => Promise<any>;
}

interface IUserModel extends Model<IUserDocument> {
    findByUsername: (username: string) => Promise<IUserDocument>;
}

const UserSchema: Schema<IUserDocument>= new Schema({
    username: {type: String, required: true},
    hashedPassword: {type: String, required: true},
});

//인스턴스 메서드: 문서를 통해 만든 문서 인스턴스에서 사용할 수 있는 함수
UserSchema.methods.setPassword = async function(password: string){ //this를 이용해야 하기 때문에 function 키워드 이용 
    const hash = await bcrypt.hash(password, 10);
    this.hashedPassword = hash;
};

UserSchema.methods.checkPassword = async function(password: string) {
    const result = await bcrypt.compare(password, this.hashedPassword);
    return result; // true/false
};

UserSchema.methods.serialize = function(){
    const data = this.toJSON();
    delete data.hashedPassword;
    return data;
}

//스태틱 메서드: 모델에서 바로 사용할 수 있는 함수
UserSchema.statics.findByUsername = function(username) {
    return this.findOne({username});
};

const User = mongoose.model<IUserDocument, IUserModel>('User', UserSchema);
export default User;