'use client';
import {useState} from 'react';
// import { useSignUp } from '@clerk/nextjs';
import { SignUp, useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

const RegisterPage =()=>{
    const {isLoaded, singUp, setActive } = useSignUp();
    const [email, setEmail] = useState('');
    const [firstname, setfirstname] = useState('');
    const [lastname, setlastname] = useState('');
    const [password, setPassword] = useState('');
    const [pendingVerification, setPendingVerification] = useState(false);
    const [code, setCode] = useState('');
    const router = useRouter();

    //Form Submit
    const handleSubmit = async (e)=>{
        e.preventDefault();

        if(!isLoaded){return;}
        try {
            await SignUp.create({
                first_name: firstname,
                last_name: lastname,
                email_address:email,
                password,
            });

            //Send email
            await SignUp.prepareEmailAddressVerification({strategy: 'email_code'});

            // Change UI upon successful verification code sent 
            setPendingVerification(true);
        } 
        catch (error) {
            console.log(error);
        }
    };

    //Verify User Email Code
    const onClickVerify = async (e)=>{
        e.preventDefault();
        if(!isLoaded){return;}
        try {
            const completeSignUp = await SignUp.attemptEmailAddressVerification({code});
            if(completeSignUp.status !== 'complete'){
                /*investigate the response to see if there was an error or if t he user needsd to complete more steps.*/
                console.log(JSON.stringify(completeSignUp, null, 2));
            }
             if(completeSignUp.status === 'complete'){
                await setActive({session: completeSignUp.createdSessionId});
                router.push('/')
            }
        } 
        catch (error) {
            console.log(JSON.stringify(completeSignUp, null, 2));
        }
    };
    return(
        <div className='border p-5 rounded' style={{width:'500px'}}>  
           <h1 className="txt-2xl mb-4">Register</h1>
                {!pendingVerification && (
                    <form onSubmit={handleSubmit} className='space-y-4 md:space-y-6'>
                        <div>
                            <label htmlFor='first_name' className='block mb-2 text-sm font-medium text-gray-900'>
                                First Name
                            </label>
                            <input 
                                type='text' 
                                name='first_name'
                                id='first_name'
                                onChange={(e)=> setfirstname(e.target.value)}
                                className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5'
                                required={true}
                            />
                        </div>
                        <div>
                            <label htmlFor='last_name' className='block mb-2 text-sm font-medium text-gray-900'>
                                Last Name
                            </label>
                            <input 
                                type='text' 
                                name='last_name'
                                id='last_name'
                                onChange={(e)=> setlastname(e.target.value)}
                                className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5'
                                required={true}
                            />
                        </div>
                        <div>
                            <label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-900'>
                                Email Address
                            </label>
                            <input 
                                type='text' 
                                name='email'
                                id='email' placeholder='name@example.com'
                                onChange={(e)=> setEmail(e.target.value)}
                                className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5'
                                required={true}
                            />
                        </div>
                        <div>
                            <label htmlFor='password' className='block mb-2 text-sm font-medium text-gray-900'>
                                Password
                            </label>
                            <input 
                                type='password' 
                                name='password'
                                id='password' 
                                onChange={(e)=> setPassword(e.target.value)}
                                className='bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5'
                                required={true}
                            />
                        </div>
                        <button type='submit' className='w-full text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center'>
                            Create an Account
                        </button>
                    </form>
                )} 
                {pendingVerification && (
                    <div>
                        <form className='space-y-4 md:space-y-6'>
                            <input
                            value={code}
                            className='bg-gray-500 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5'
                            placeholder='Enter Verification Code to your email...'
                            onChange={(e)=> setCode(e.target.value)}
                            />
                            <button
                            type='submit'
                            onClick={onClickVerify}
                            className='w-full text-white bg-blue-600 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center'>
                            Verify Email
                            </button>
                        </form>
                    </div>
                )}           
        </div>
    );

};
export default RegisterPage()