import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Card} from "@/components/ui/card.tsx";
import {useMutation} from "@tanstack/react-query";
import axios from "axios";
import type {User} from "@/types/auth.ts";
import {useEffect, useState} from "react";
import {useAuth} from "@/contexts/AuthContext.tsx";
import {useNavigate} from "react-router-dom";

async function login(phoneNumOrEmail: string, password: string): Promise<{
  user: User,
  token: string,
}> {
  const res = await axios.post("http://localhost:8080/api/auth/login", {
    phoneNumOrEmail: phoneNumOrEmail,
    password: password
  });
  return res.data;
}

export default function LoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if(auth.isReady && auth.isLoggedIn()) {
      navigate("/dashboard");
    }
  }, [auth, navigate]);

  const [phoneNumOrEmail, setPhoneNumOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");

  const loginMutation = useMutation({
    mutationFn: () => login(phoneNumOrEmail, password),
    onSuccess: data => {
      if(data.user.role === "CUSTOMER") {
        setErrorText("Thông tin đăng nhập không chính xác");
        return;
      }
      auth.setTokenAndMyInfo(data.token, data.user);
      navigate("/dashboard");
    },
    onError: () => {
      setErrorText("Thông tin đăng nhập không chính xác");
    }
  });


  return (
    <div className={"w-full flex justify-center pt-10 px-2"}>
      <Card className={"max-w-[500px] w-full px-8"}>
        <form onSubmit={(e) => {
          e.preventDefault();
          loginMutation.mutate();
        }} className={"flex flex-col gap-4 items-center"}>
          <div className={"mb-4 text-xl font-[600]"}>Admin Dashboard F&B</div>
          <div className={"flex flex-col items-start w-full gap-2"}>
            <div>Nhập Email hoặc Số điện thoại</div>
            <Input
              onChange={(e) => {setPhoneNumOrEmail(e.target.value)}}
              value={phoneNumOrEmail}
              type={"text"}
              placeholder={"Email/SĐT"}
            />
          </div>
          <div className={"flex flex-col items-start w-full gap-2"}>
            <div>Nhập mật khẩu</div>
            <Input
              onChange={(e) => {setPassword(e.target.value)}}
              value={password}
              type={"password"}
              placeholder={"Mật khẩu"}
            />
          </div>
          <div className={`${errorText === "" && "hidden"} text-destructive text-center text-sm w-full gap-2`}>
            {errorText}
          </div>
          <Button type={"submit"} className={"mt-6 w-fit px-10 py-6 rounded-full cursor-pointer"}>Đăng nhập</Button>
        </form>
      </Card>
    </div>
  )
}