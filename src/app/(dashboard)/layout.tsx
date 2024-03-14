import { CheckAuth, ClearAuth } from "@/action/auth";
import Logo from "@/components/elements/logo";
import ThemeSwitcher from "@/components/elements/theme-switcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
  const user = await CheckAuth();
  if(!user) {
    return;
  }
  return (
    <div className="flex flex-col min-h-screen min-w-full bg-background max-h-screen">
      <nav className="flex justify-between items-center border-b border-border h-[60px] px-4 py-2">
        <Logo/>
        <div className="flex gap-4 items-center">
          <ThemeSwitcher/>
          <form action={ClearAuth}>
            <button type='submit' id='logOut'>
              <Avatar>
                  <AvatarImage src={user.image??''} alt="Аватар" />
                  <AvatarFallback>{`${user.surname[0]}${user.name[0]}`}</AvatarFallback>
              </Avatar>
            </button>
          </form>
        </div>
      </nav>
        <main className="flex w-full flex-grow">
          {children}  
        </main>
    </div>
  );
}
