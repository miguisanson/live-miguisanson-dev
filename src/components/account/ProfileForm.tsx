"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { accountPolicy } from "@/lib/account-policy";
import { updateProfileAction, type ProfileFormState } from "@/app/account/actions";

type ProfileFormProps = {
  displayName: string;
  bio: string;
};

const initialState: ProfileFormState = {
  ok: false,
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className="account-primary-button account-form-submit" type="submit" disabled={pending}>
      {pending ? "Saving..." : "Save profile"}
    </button>
  );
}

export function ProfileForm({ displayName, bio }: ProfileFormProps) {
  const [state, formAction] = useActionState(updateProfileAction, initialState);

  return (
    <form className="account-form profile-edit-form" action={formAction}>
      {state.message ? (
        <p className={state.ok ? "account-notice" : "account-error"} aria-live={state.ok ? "polite" : "assertive"}>
          {state.message}
        </p>
      ) : null}

      <label>
        Display name
        <input
          name="displayName"
          defaultValue={displayName}
          minLength={accountPolicy.displayNameMinLength}
          maxLength={accountPolicy.displayNameMaxLength}
          required
        />
      </label>

      <label>
        Bio
        <textarea
          name="bio"
          defaultValue={bio}
          maxLength={accountPolicy.bioMaxLength}
          rows={5}
          placeholder="A short public profile note."
        />
      </label>

      <SubmitButton />
    </form>
  );
}
