const Footer = () => {
    return (
        <>
            <footer className='bg-[#1d262d] text-white leading-7'>
                {/* 1D252C 141838 */}
                <div className='max-w-[1272px] mx-auto p-6 pb-10 grid gap-3 grid-cols-12'>
                    <h2 className='text-2xl col-span-12 md:col-span-3 font-mont font-bold'>Trade Mark Today</h2>
                    <nav className='md:col-start-5 col-span-6 md:col-span-3'>
                        <ul className='flex gap-y-4 flex-col font-mont text-[16px]'>
                            <style jsx>{`li a {padding:4px; border-radius: 2px;} li a:hover {background-color:#72757E} `}</style>
                            <li> <h4><a href="#">Privacy notice</a></h4></li>
                            <li> <h4><a href="#">Disclaimer</a></h4></li>
                            <li> <h4><a href="#">Contact us</a></h4></li>
                            <li> <h4><a href="#">Give feedback</a></h4></li>
                        </ul>
                    </nav>
                    <p className='md:col-start-9 col-span-6 md:col-span-4 xl:col-start-8 xl:col-span-5 leading-6 text-[12px]'> We acknowledge the traditional owners of the country throughout Australia and their continuing connection to land, sea and community. We pay our respect to them and their cultures and to the elders past and present. </p>
                </div>
            </footer>
        </>
    )
}
export default Footer;