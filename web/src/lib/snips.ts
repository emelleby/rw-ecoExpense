<Link
  to={typeof item.url === 'function' ? item.url() : item.url}
>
  <item.icon />
  <span>{item.title}</span>
</Link>
