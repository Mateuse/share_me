export const fetchUser = () => {
    const userInfo: any = JSON.parse(localStorage.getItem("user") ?? "null");
    return userInfo;
}