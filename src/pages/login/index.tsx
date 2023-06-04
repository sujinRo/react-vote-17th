import type { NextPage, NextPageContext } from "next";
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from "next/router";
import axios from "axios";
import { Cookies } from "react-cookie";

interface formValue {
  id: string;
  password: string;
}

const cookies = new Cookies(); // cookie 사용을 위한 선언

const LoginPage: NextPage = () => {
  const router = useRouter();
  
  const {register, handleSubmit, watch, formState: {errors}} = useForm<formValue>();
  /**
   * register: input이 받을 값 정의
   * handleSubmit: 각 항목이 입력되었을 때, submit 이벤트 처리
   * watch: register한 항목의 변경사항 추적
   * errors: 유효성이 통과되지 않으면 에러상태 내보냄
   */

  const onSubmitHandler: SubmitHandler<formValue> = (data) => {
    const loginId = data.id;
    const base64pw = btoa(data.password);
    const newLoginArray = {
      id: loginId,
      password: base64pw,
    };
      /**
   * Form에서 submit했을 때, 실행되는 함수
   * Form에서 받아온 data를 매개변수로 사용하여 값을 받아옴
   * 비밀번호는 base64로 변환하고, 이 후, 객체를 새로 만듦
   */

    axios
    .post('/api/user', newLoginArray)
    .then((response) => {
      const {accessToken} = response.data;
      cookies.set('LoginToken', accessToken, {
        path: '/',
        secure: true,
        sameSite: 'none',
      });
      router.replace('/home');
    })
    .catch((error) => {
      alert('아이디 또는 비밀번호를 확인해주세요')
    })
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmitHandler)}>
        <div>아이디</div>
        <input {...register('id')} />
        <div>비밀번호</div>
        <input {...register('password')} type="password" />
        <button>로그인</button>
      </form>
    </div>
  )

}
export default LoginPage;
