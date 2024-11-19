<Link
  to={typeof item.url === 'function' ? item.url() : item.url}
>
  <item.icon />
  <span>{item.title}</span>
</Link>

<div className="flex w-full flex-col bg-slate-50 dark:bg-slate-900">
  <SidebarTrigger />
  <main className="container max-w-6xl ">{children}</main>
</div>
