export default function Layout({children}: Readonly<{children: React.ReactNode;}>) {
    return (
      <div className='flex w-full flex-grow mx-auto'>
        {children}
      </div>
    );
  }
  