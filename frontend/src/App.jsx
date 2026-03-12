import { useState } from 'react';
import Signup from './Signup';
import Signin from './Signin';

function App() {
  const [isSignin, setIsSignin] = useState(true);

  return (
    <div>
      {isSignin ? <Signin /> : <Signup />}
      <div className="text-center mt-4">
        <button onClick={() => setIsSignin(!isSignin)} className="text-blue-500 hover:underline">
          {isSignin ? 'Need to sign up?' : 'Already have an account?'}
        </button>
      </div>
    </div>
  );
}

export default App;