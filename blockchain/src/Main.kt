fun main() {
    val hasher = Hasher()

    println("Hash: ${hasher.hash("emn566")}")

    var found = 0
    val matches = mutableMapOf<Int, MutableList<String>>()

    for (i in 1..999999) {
        val input = "EMN$i"
        val hashed = hasher.hash(input)

        val leadingZeros = hashed.takeWhile { it == '0' }.length

        if (leadingZeros >= 2) {
            matches.getOrPut(leadingZeros) { mutableListOf() }.add(input)
            found++
        }
    }

    println("Total trouvé: $found")
    matches.toSortedMap().forEach { (zeros, inputs) ->
        println("$zeros zéros: ${inputs.size} hash(es) - ${inputs.joinToString(", ")}")
    }
}

//fun main() {
//    val hasher = Hasher()
//
//    println("Hash: ${hasher.hash("emn566")}")
//
//    var found = 0
////    emn56 value: 793b22c8c346d6598fb5338a182305fbd0533b6a13d9b147bdc7d62f62c6ea5e
//
//    for (i in 1..9999) {
//        val input = "enm$i"
//        val hashed = hasher.hash(input)
//
//        if (hashed.startsWith("000")) {
//            println("Found matching hash for input '$input': $hashed")
//            found++
//        }
//
//
//        println("Input: $input -> Hash: $hashed")
//    }
//    println("Total found: $found")
//}