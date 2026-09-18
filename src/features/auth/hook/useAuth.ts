import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

interface LoginResponse {
    access_token: string;
    token_type: string;
    id_user: string;
    id_role: string | number;
}

export const useAuth = () => {
    // Utilizamos useMutation para manejar la petición de inicio de sesión
    const loginMutation = useMutation({
        mutationFn: async ({ email, password }: Record<string, string>) => {
            // Formateamos los datos a x-www-form-urlencoded como exige OAuth2PasswordRequestForm
            const params = new URLSearchParams();
            params.append('username', email); // FastAPI espera que el email viaje en el campo 'username'
            params.append('password', password);

            // Realizamos la petición HTTP. (Idealmente, reemplaza 'axios' por tu instancia configurada si la tienes)
            const response = await axios.post<LoginResponse>(
                'http://localhost:8000/api/v1/auth/login', // Ajusta la URL base a la de tu entorno
                params,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );

            return response.data;
        },
        onSuccess: (data) => {
            // Si la petición es exitosa, guardamos el token en el almacenamiento local
            localStorage.setItem('token', data.access_token);

            // Opcional: Puedes guardar otros datos útiles del usuario
            localStorage.setItem('id_user', data.id_user);
            localStorage.setItem('id_role', data.id_role.toString());
        },
    });

    const login = async (email: string, password: string) => {
        return loginMutation.mutateAsync({ email, password });
    };

    // Función para cerrar sesión fácilmente
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('id_user');
        localStorage.removeItem('id_role');
    };

    return {
        login,
        logout,
        isLoading: loginMutation.isPending,
        error: loginMutation.error,
    };
};