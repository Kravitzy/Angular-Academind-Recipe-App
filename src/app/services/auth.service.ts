export class AuthService {
    private loggedIn = false;

    isAuthenticated(){
        const promise = new Promise(
            (resolve, rej) => { 
                setTimeout(() => {
                    resolve(this.login())
                }, 800)
            }
        )
        return promise;
    }

    login(){
        this.loggedIn = true;
    }

    logout(){
        this.loggedIn = false;
    }
}