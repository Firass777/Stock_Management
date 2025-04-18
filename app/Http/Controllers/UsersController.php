<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth;

class UsersController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|string|in:Admin,Manager,Stock Keeper,Viewer',
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }
    
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);
    
        $token = JWTAuth::fromUser($user);
    
        return response()->json([
            'success' => true,
            'message' => 'User registered successfully',
            'user' => $user,
            'token' => $token
        ], 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }
    
        $user = User::where('email', $request->email)->first();
    
        if (!$user) {
            return response()->json([
                'success' => false,
                'error' => 'Invalid email address'
            ], 401);
        } elseif (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'error' => 'Incorrect password'
            ], 401);
        }
    
        $token = JWTAuth::fromUser($user);
    
        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'token' => $token,
            'user' => $user->makeHidden(['password', 'created_at', 'updated_at']),
            'role' => $user->role,
        ]);
    }

    public function logout(Request $request)
    {
        try {
            $token = JWTAuth::getToken();
    
            if (!$token) {
                return response()->json([
                    'success' => false,
                    'error' => 'Token not provided'
                ], 401);
            }
    
            JWTAuth::invalidate($token);
    
            return response()->json([
                'success' => true,
                'message' => 'Logged out successfully'
            ]);
        } catch (\Tymon\JWTAuth\Exceptions\JWTException $e) {
            return response()->json([
                'success' => false,
                'error' => 'Failed to log out'
            ], 500);
        }
    }

    public function index(Request $request)
    {
        $query = User::query();
        
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', '%'.$search.'%')
                  ->orWhere('email', 'like', '%'.$search.'%')
                  ->orWhere('role', 'like', '%'.$search.'%');
            });
        }

        $perPage = $request->input('per_page', 10);
        $users = $query->paginate($perPage);
        
        return response()->json([
            'success' => true,
            'data' => $users->items(),
            'meta' => [
                'current_page' => $users->currentPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
                'last_page' => $users->lastPage(),
            ]
        ]);
    }

    public function show($id)
    {
        $user = User::find($id);
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'error' => 'User not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $user
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|string|in:Admin,Manager,Stock Keeper,Viewer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'User created successfully',
            'data' => $user
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'error' => 'User not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,'.$user->id,
            'password' => 'sometimes|string|min:8|confirmed',
            'role' => 'sometimes|string|in:Admin,Manager,Stock Keeper,Viewer',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->only(['name', 'email', 'role']);
        if ($request->has('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $user->update($data);

        return response()->json([
            'success' => true,
            'message' => 'User updated successfully',
            'data' => $user
        ]);
    }

    public function destroy($id)
    {
        $user = User::find($id);
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'error' => 'User not found'
            ], 404);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully'
        ]);
    }
}