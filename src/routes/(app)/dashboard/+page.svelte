<script>
  let user = {
    name: "Rusty Clown",
    role: "DevOps Engineer",
    avatar: "https://i.pravatar.cc/100"
  };

  let stats = [
    { title: "Active Projects", value: 12 },
    { title: "Builds Today", value: 8 },
    { title: "Alerts", value: 3 },
    { title: "Commits", value: 26 }
  ];
</script>

<div class="min-h-screen bg-gray-900 text-gray-100 p-6">
  <div class="flex justify-between items-center mb-8">
    <h1 class="text-2xl font-bold">Dashboard</h1>
    <div class="flex items-center space-x-4">
      <span class="text-sm">{user.name} ({user.role})</span>
      <img src={user.avatar} alt="Avatar" class="w-10 h-10 rounded-full" />
    </div>
  </div>

  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    {#each stats as stat}
      <div class="bg-gray-800 p-4 rounded-2xl shadow-lg">
        <p class="text-gray-400 text-sm">{stat.title}</p>
        <p class="text-2xl font-semibold mt-2">{stat.value}</p>
      </div>
    {/each}
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div class="bg-gray-800 p-6 rounded-2xl col-span-2 shadow-lg">
      <h2 class="text-xl font-semibold mb-4">System Activity</h2>
      <div class="h-64 flex items-center justify-center text-gray-500">
        <!-- Placeholder for a graph or chart -->
        Graph Component Here
      </div>
    </div>

    <div class="bg-gray-800 p-6 rounded-2xl shadow-lg">
      <h2 class="text-xl font-semibold mb-4">Recent Events</h2>
      <ul class="space-y-3">
        <li class="text-sm">✅ Deployment to staging successful</li>
        <li class="text-sm">⚠️ High memory usage alert</li>
        <li class="text-sm">✅ Jenkins pipeline completed</li>
        <li class="text-sm">🕒 Scheduled backup in progress</li>
      </ul>
    </div>
  </div>
</div>