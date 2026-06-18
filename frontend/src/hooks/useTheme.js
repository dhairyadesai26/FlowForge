import {useEffect,useState} from 'react';


export default function useTheme(){

const [dark,setDark]=useState(true);


useEffect(()=>{

document.documentElement.classList.toggle(
'dark',
dark
);

},[dark]);


return{

dark,
setDark

};


}