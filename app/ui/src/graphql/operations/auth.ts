import { graphql } from '../generated';

export const AuthUserFragment = graphql(`
  fragment AuthUser on User {
    id
    email
    firstName
    lastName
    profilePicture
    role
    isVerified
    createdAt
    updatedAt
  }
`);

export const MeQuery = graphql(`
  query Me {
    me {
      ...AuthUser
    }
  }
`);

export const LoginMutation = graphql(`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        ...AuthUser
      }
    }
  }
`);

export const RegisterMutation = graphql(`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        ...AuthUser
      }
    }
  }
`);

export const ForgotPasswordMutation = graphql(`
  mutation ForgotPassword($email: String!) {
    forgotPassword(input: { email: $email })
  }
`);

export const ResetPasswordMutation = graphql(`
  mutation ResetPassword($token: String!, $password: String!) {
    resetPassword(input: { token: $token, password: $password })
  }
`);

export const UpdateProfileMutation = graphql(`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      ...AuthUser
    }
  }
`);
