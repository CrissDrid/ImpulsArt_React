import React, { useEffect, useState, useRef } from 'react'; 
import { Password } from 'primereact/password'; 
import { Toast } from 'primereact/toast'; 
import Swal from 'sweetalert2'; 
import '../Styles/ChangePWD.css';

//Autenticacion de apis
import '../Auth/AuthToken';

function ChangePWD() { 
    const [userData, setUserData] = useState(null); 
    const [currentPassword, setCurrentPassword] = useState(''); 
    const [newPassword, setNewPassword] = useState(''); 
    const [confirmPassword, setConfirmPassword] = useState(''); 
    const [isButtonDisabled, setIsButtonDisabled] = useState(true); 
    const toast = useRef(null);

    useEffect(() => { 
        const user = JSON.parse(localStorage.getItem('user')); 
        if (user) { 
            setUserData(user); 
        } 
    }, []);

    const handleCurrentPasswordChange = (e) => { 
        setCurrentPassword(e.target.value); 
        verifyCurrentPassword(e.target.value); 
    };

    const verifyCurrentPassword = (currentPassword) => { 
        if (userData && userData.contrasena === currentPassword) { 
            setIsButtonDisabled(false); 
        } else { 
            setIsButtonDisabled(true); 
        } 
    };

    const handleSubmit = async (e) => { 
        e.preventDefault();

        if (newPassword === currentPassword) { 
            toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'La contraseña nueva no puede ser la misma que la contraseña actual', life: 3000 }); 
            return; 
        } else if (newPassword !== confirmPassword) { 
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Las contraseñas no coinciden', life: 3000 }); 
            return; 
        } else if (!isStrongPassword(newPassword)) { 
            const message = getWeakPasswordMessage(newPassword); 
            toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: message, life: 3000 }); 
            return; 
        }

        const result = await Swal.fire({ 
            title: '¿Estás seguro de cambiar la contraseña?', 
            text: '¡No podrás revertir esto!', 
            icon: 'warning', 
            showCancelButton: true, 
            confirmButtonColor: '#8D33FF', 
            cancelButtonColor: '#d33', 
            confirmButtonText: 'Sí, cambiarla', 
            cancelButtonText: 'Cancelar' 
        });

        if (result.isConfirmed) { 
            try { 
                const response = await fetch(`http://localhost:8086/api/usuario/update/${userData.identificacion}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...userData, contrasena: newPassword }) }); 
                const result = await response.json(); 
                if (response.ok) { 
                    console.log('Contraseña actualizada:', result); 
                    localStorage.setItem('user', JSON.stringify({ ...userData, contrasena: newPassword })); 
                    setIsButtonDisabled(true); 
                    toast.current.show({ severity: 'success', summary: 'Actualizado', detail: 'La contraseña se actualizó con éxito', life: 3000 }); 
                    window.location.reload(); 
                } else { 
                    console.error('Error al actualizar:', result); 
                    toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al actualizar la contraseña', life: 3000 }); 
                } 
            } catch (error) { 
                console.error('Error de red:', error); 
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error de red', life: 3000 }); 
            } 
        } 
    };

    const isStrongPassword = (password) => { 
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[./@$!%*?&])[A-Za-z\d./@$!%*?&]{8,}$/.test(password); 
    };

    const getWeakPasswordMessage = (password) => { 
        const messages = []; 
        if (!/[a-z]/.test(password)) { messages.push('una letra minúscula'); } 
        if (!/[A-Z]/.test(password)) { messages.push('una letra mayúscula'); } 
        if (!/\d/.test(password)) { messages.push('un número'); } 
        if (!/[./@$!%*?&]/.test(password)) { messages.push('un carácter especial'); } 
        if (password.length < 8) { messages.push('al menos 8 caracteres'); } 
        return `La contraseña debe contener ${messages.join(', ')}`; 
    };

    return ( 
        <div className="user-data"> 
            <h2>Cambiar Contraseña</h2> 
            <form onSubmit={handleSubmit}> 
                <div className='change-password'> 
                    <div className="form-floating"> 
                        <Password className='pwd-act' feedback={false} placeholder="Contraseña actual" value={currentPassword} onChange={handleCurrentPasswordChange} /> 
                    </div> 
                    <div className="form-floating"> 
                        <Password toggleMask placeholder='Nueva Contraseña' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} promptLabel="Ingrese la contraseña" weakLabel='Contraseña Débil' mediumLabel='Contraseña Media' strongLabel='Contraseña Fuerte' /> 
                    </div> 
                    <div className="form-floating"> 
                        <Password toggleMask feedback={false} placeholder="Confirmar Contraseña" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /> 
                    </div> 
                </div> 
                <Toast ref={toast} /> 
                <button className="btn btn-primary change-btn" type="submit" disabled={isButtonDisabled}>Cambiar Contraseña</button> 
            </form> 
        </div> 
    ); 
}

export default ChangePWD;
