import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface BreadcrumbProps {
  firstPage: string;
  secondPage?: string;
}

export const BreadcrumbCf = ({
  firstPage,
  secondPage = "",
}: BreadcrumbProps) => {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-black top-0 ">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1 text-yellow-500 hover:bg-black active:bg-black hover:text-white" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4 text-yellow-700"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="block">{firstPage}</BreadcrumbItem>
            {secondPage != "" && (
              <>
                <BreadcrumbSeparator className="hidden md:block text-yellow-500" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-yellow-500">
                    {secondPage}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
};
