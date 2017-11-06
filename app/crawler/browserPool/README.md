# Browser Pool



WikiPedia :: Pool (computer science)

  In computer science, a pool is a set of resources that are kept ready to use,
  rather than acquired on use and released afterwards. In this context, resources
  can refer to system resources such as file handles, which are external to a
  process, or internal resources such as objects. A pool client requests a
  resource from the pool and performs desired operations on the returned resource.
  When the client finishes its use of the resource, it is returned to the pool
  rather than released and lost.

  The pooling of resources can offer a significant performance boost in situations
  that have high cost associated with resource acquiring, high rate of the
  requests for resources, and a low overall count of simultaneously used resources.
  Pooling is also useful when the latency is a concern, because a pool offers
  predictable times required to obtain resources since they have already been
  acquired. These benefits are mostly true for system resources that require a
  system call, or remote resources that require a network communication, such as
  database connections, socket connections, threads, and memory allocation.
  Pooling is also useful for expensive-to-compute data, notably large graphic
  objects like fonts or bitmaps, acting essentially as a data cache or a
  memoization technique.

  Special cases of pools are connection pools, thread pools, and memory pools.
