

const validateFormUsername = (username) => {

}

export const isPasswordValid = (password) => {
    const regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{6,16}$/;
    return regex.test(password)
}

export const isEmailValid = (email) =>{
    const emailRegex =  /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/ 
    return emailRegex.test(email);
}


const getUserFromLocalStorage = () => {
    USERNAME_LOCALSTAGE_KEY
    usernam 
}

const saveUserToLocalStorage = () => {
    USERNAME_LOCALSTAGE_KEY
}
