namespace InstaTalk.Models
{
    public class StrangerFilterDto
    {
        public string FindGener { get; set; }

        public int MinAge { get; set; } = 0;

        public int MaxAge { get; set; } = 100;

        public ICollection<string> FindRegion { get; set; } = new List<string>();

        public ICollection<string> FindType { get; set; } = new List<string>();
    }
}
