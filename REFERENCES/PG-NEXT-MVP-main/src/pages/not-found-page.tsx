import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { PageHeader } from "../components/common/page-header";

export function NotFoundPage(): React.ReactElement {
  return (
    <section className="space-y-4">
      <PageHeader
        title="Route not found"
        subtitle="This view is not part of the Consumer IQ presentation prototype."
      />
      <Link to="/overview">
        <Button>Go to overview</Button>
      </Link>
    </section>
  );
}
