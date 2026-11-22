import { Link } from "react-router-dom";
import { papersUrl } from "@jagger-ui/urls";
import {
  modes,
  modeInfo,
  type DocProject,
  type DocPage,
} from "../../content/docs";
import ProjectSwitcher from "./ProjectSwitcher";

export default function DocsSidebar({
  project,
  active,
}: {
  project: DocProject;
  active?: DocPage;
}) {
  const slug = project.source.slug;
  return (
    <aside className="docs-sidebar">
      <a href={papersUrl(`/${slug}`)}>Read the project story →</a>
      <ProjectSwitcher slug={project.source.slug} name={project.name} />
      <nav aria-label="Project documentation">
        {modes.map((m) => (
          <div key={m}>
            <Link className="docs-mode-title" to={`/${slug}/${m}`}>
              {modeInfo[m].title}
            </Link>
            {project.pages
              .filter((p) => p.mode === m)
              .map((p) => (
                <Link
                  key={p.id}
                  aria-current={active === p ? "page" : undefined}
                  to={`/${slug}/${m}/${p.id}`}
                >
                  {p.title}
                </Link>
              ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}
