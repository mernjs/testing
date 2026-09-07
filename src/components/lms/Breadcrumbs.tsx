import { Fragment } from "react";
import Link from "next/link";
import { Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export interface BreadcrumbItemData {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: BreadcrumbItemData[] }) {
  return (
    <Breadcrumb className="mb-1.5">
      <BreadcrumbList className="gap-1.5">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          const isFirst = i === 0;
          return (
            <Fragment key={`${item.label}-${i}`}>
              {i > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {isLast || !item.href ? (
                  <BreadcrumbPage className="flex items-center gap-1 font-medium text-foreground">
                    {isFirst && <Home className="size-3.5" />}
                    {item.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    render={
                      <Link href={item.href} className="flex items-center gap-1 hover:text-primary">
                        {isFirst && <Home className="size-3.5" />}
                        {item.label}
                      </Link>
                    }
                  />
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
