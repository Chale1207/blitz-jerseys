import { KitForm } from "../kit-form";

export const metadata = { title: "Add Pre-order Kit — Admin" };

export default function NewPreOrderKitPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 font-display text-2xl font-bold uppercase text-ink-900">Add pre-order kit</h1>
      <div className="rounded-2xl border border-border bg-white p-6">
        <KitForm />
      </div>
    </div>
  );
}
